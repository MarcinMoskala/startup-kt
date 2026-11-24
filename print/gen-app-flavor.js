// Generates app/src/commonMain/kotlin/startupkt/ui/PrintFlavor.kt from the print card data and prints the card ids.
const fs = require('fs'), vm = require('vm'), path = require('path');
const dir = __dirname, ctx = { console }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(dir, 'cards.js'), 'utf8') + ';this.sortedCards = sortedCards; this.C = C;', ctx);
for (const f of fs.readdirSync(path.join(dir, 'data')).filter(f => f.endsWith('.js')).sort())
  vm.runInContext(fs.readFileSync(path.join(dir, 'data', f), 'utf8'), ctx);
const C = ctx.C, name = {};
for (const [k, v] of Object.entries(C)) if (!name[v.toUpperCase()]) name[v.toUpperCase()] = k;
const col = h => { const n = name[h.toUpperCase()]; return ['fn', 'kw', 'str', 'cls', 'text', 'faint', 'muted'].includes(n) ? 'Syntax.' + n : 'Color(0xFF' + h.slice(1).toUpperCase() + ')'; };
const q = s => JSON.stringify(s).replace(/\$/g, '\\$');
const hex = h => 'Color(0xFF' + h.slice(1).toUpperCase() + ')';
let out = `package startupkt.ui

import androidx.compose.ui.graphics.Color
import org.jetbrains.compose.resources.DrawableResource
import startupkt.ui.res.Res
import startupkt.ui.res.*

// GENERATED from print/cards.js + print/data/*.js by print/export-app.sh. Do not edit by hand.

/** IntelliJ-like syntax colours used in the card flavor code (same as the printed cards). */
object Syntax {
${['fn', 'kw', 'str', 'cls', 'text', 'faint', 'muted'].map(k => `    val ${k} = ${hex(C[k])}`).join('\n')}
}

/** Per-card print design data: IDE tab file name, one line of flavor code (coloured tokens) and a comment. */
class PrintFlavor(val file: String, val code: List<Pair<Color, String>>, val comment: String, val art: DrawableResource)

val printFlavors: Map<String, PrintFlavor> by lazy {
    mapOf(
`;
const cards = ctx.sortedCards();
for (const c of cards)
  out += `        ${q(c.id)} to PrintFlavor(\n            ${q(c.file)},\n            listOf(${c.code.map(([k, s]) => `${col(k)} to ${q(s)}`).join(', ')}),\n            ${q(c.comment)},\n            Res.drawable.art_${c.id.replace(/-/g, '_')},\n        ),\n`;
out += '    )\n}\n';
fs.writeFileSync(path.join(dir, '../app/src/commonMain/kotlin/startupkt/ui/PrintFlavor.kt'), out);
console.log(cards.map(c => c.id).join('\n'));
