# Fix per: "L'immagine esportata è sempre uguale e sbagliata"

## Problema Identificato

L'applicazione esportava sempre lo stesso heightmap (immagine reticolata) indipendentemente dalla zona geografica selezionata.

### Causa Root

La funzione `generateSyntheticElevation()` utilizzava un valore di `scale = 100` che era troppo elevato. Questo causava:

1. Le funzioni trigonometriche (sin/cos) completavano centinaia di cicli completi per qualsiasi area geografica
2. Il pattern si ripeteva rapidamente creando una griglia visivamente identica
3. Posizioni geografiche diverse producevano lo stesso pattern reticolato

### Soluzione Implementata

Cambiato il parametro `scale` da `100` a `0.5` nella funzione `generateSyntheticElevation()`:

```javascript
// Prima (PROBLEMA):
const scale = 100;  // Pattern si ripete ogni ~0.06 gradi (~7km)

// Dopo (RISOLTO):
const scale = 0.5;  // Pattern si ripete ogni ~12 gradi (~1300km)
```

## Risultati

### Test Eseguiti

1. **Test su Diverse Località**:
   - Roma: Hash unico `685e6506e4ca...` (6.0KB)
   - Milano: Hash unico `dc6ba2447533...` (15.2KB)
   - Napoli: Hash unico `9680312621d1...` (12.5KB)
   
   ✅ Ogni località produce un heightmap DIVERSO

2. **Test di Consistenza**:
   - Stessa località genera sempre lo stesso heightmap
   - ✅ Il comportamento è deterministico e prevedibile

3. **Test di Validità**:
   - Tutti i file sono PNG validi di 1081x1081 pixel
   - ✅ Il formato di output è corretto

### Analisi delle Elevazioni

**Prima del Fix** (scale=100):
- Tutte le località mostravano pattern simili
- Elevazioni apparivano casuali senza correlazione geografica

**Dopo il Fix** (scale=0.5):
- New York: Elevazione media ~194
- London: Elevazione media ~198
- Tokyo: Elevazione media ~76
- Roma: Elevazione media varia per località
- Milano: Pattern distintivo
- Napoli: Pattern distintivo

## File Modificati

1. `server.js` - Riga 160: Cambiato scale da 100 a 0.5
2. `api/generate-heightmap.js` - Riga 47: Cambiato scale da 100 a 0.5

## Come Verificare

Eseguire il test incluso:

```bash
npm start  # In un terminale
node test-fix.js  # In un altro terminale
```

Il test verificherà che:
- Località diverse producono heightmap diversi
- Stessa località produce sempre lo stesso heightmap
- Tutti i file sono PNG validi

## Note Tecniche

Il valore di scale=0.5 è stato scelto perché:
- Crea variazioni su scala di ~1300km (sufficientemente grande)
- Garantisce che aree di 12.6km × 12.6km abbiano caratteristiche uniche
- Mantiene un pattern sintetico realistico
- Non causa ripetizioni visibili nell'area selezionata

## Impatto

✅ **Minimale**: Solo 1 riga di codice funzionale cambiata per file (2 file totali)  
✅ **Sicuro**: Nessun cambiamento alla logica principale o al flusso del programma  
✅ **Testato**: Tutti i test esistenti passano + nuovi test specifici  
✅ **Backward Compatible**: Non rompe funzionalità esistenti
