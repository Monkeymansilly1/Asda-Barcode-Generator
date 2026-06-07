function luhn(number) {
    let sum = 0;
    let alt = true;

    for (let i = number.length - 1; i >= 0; i--) {
        let n = parseInt(number[i]);

        if (alt) {
            n *= 2;
            if (n > 9) n -= 9;
        }

        sum += n;
        alt = !alt;
    }

    return (10 - (sum % 10)) % 10;
}

// ============================
// 🔒 EAN INPUT LOCK (13 digits max)
// ============================

const eanInput = document.getElementById("ean");

if (eanInput) {
    eanInput.addEventListener("input", () => {
        eanInput.value = eanInput.value
            .replace(/\D/g, "")   // remove non-numbers
            .slice(0, 13);        // max 13 digits
    });
}

// ============================
// MAIN GENERATE FUNCTION
// ============================

function generate() {

    const product = document.getElementById("product").value.trim();
    const ean = document.getElementById("ean").value.trim();
    const priceText = document.getElementById("price").value.trim();

    // 🔒 strict EAN-13 validation
    if (ean.length !== 13) {
        alert("EAN must be exactly 13 digits");
        return;
    }

    const price = parseFloat(priceText);

    if (isNaN(price)) {
        alert("Enter a valid price");
        return;
    }

    const pence = Math.round(price * 100);
    const priceField = String(pence).padStart(5, "0");

    // Build payload
    const payload = "330" + ean + priceField + "2056";

    const check = luhn(payload);
    const fullCode = payload + check;

    // Output product name
    const titleEl = document.getElementById("productTitle");
    if (titleEl) titleEl.innerText = product;

    // Output barcode number
    const outputEl = document.getElementById("numberOutput");
    if (outputEl) outputEl.innerText = fullCode;

    // Generate barcode
    JsBarcode("#barcode", fullCode, {
        format: "CODE128",
        width: 2,
        height: 120,
        displayValue: false,
        margin: 10
    });

    // Show area
    const area = document.getElementById("barcodeArea");
    if (area) area.style.display = "block";
}
