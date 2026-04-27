let items = [];
let currentInvoiceNumber = "";

/* ---------------- ADD ITEM ---------------- */
function addItem() {
  const item = document.getElementById("item").value.trim();
  const qty = parseInt(document.getElementById("qty").value);
  const price = parseFloat(document.getElementById("price").value);

  if (!item || qty <= 0 || price <= 0) {
    alert("Please enter valid item details");
    return;
  }

  const total = qty * price;

  // Save item
  items.push({ item, qty, price, total });

  renderTable();

  // Clear inputs
  document.getElementById("item").value = "";
  document.getElementById("qty").value = "";
  document.getElementById("price").value = "";
}

/* ---------------- RENDER TABLE ---------------- */
function renderTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  items.forEach((i, index) => {
    tableBody.innerHTML += `
      <tr>
        <td>${i.item}</td>
        <td>${i.qty}</td>
        <td>₹${i.price}</td>
        <td>₹${i.total}</td>
      </tr>
    `;
  });
}

/* ---------------- GENERATE INVOICE ---------------- */
function generateInvoice() {

  if (items.length === 0) {
    alert("Please add at least one item");
    return;
  }

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;

  const extraAmount = parseFloat(document.getElementById("extraAmount").value) || 0;
  const extraReason = document.getElementById("extraReason").value;

  // Customer info
  document.getElementById("custName").innerText = name || "---";
  document.getElementById("custPhone").innerText = phone || "---";
  document.getElementById("custEmail").innerText = email || "---";

  // Date
  document.getElementById("date").innerText = new Date().toDateString();

  // Invoice number
  if(!currentInvoiceNumber) {
    currentInvoiceNumber = getNextInvoiceNumber();
  }
  document.getElementById("invoiceNo").innerText = "INVOICE #" + currentInvoiceNumber;

  // Calculate subtotal
  let subtotal = 0;
  items.forEach(i => subtotal += i.total);

  const finalTotal = subtotal + extraAmount;

  // Extra charge display
  if (extraAmount > 0) {
    document.getElementById("extraLine").innerText = "Extra Charge: ₹" + extraAmount;
    document.getElementById("extraReasonText").innerText =
      extraReason ? "Reason: " + extraReason : "";
  } else {
    document.getElementById("extraLine").innerText = "Extra Charge: ₹0";
    document.getElementById("extraReasonText").innerText = "";
  }

  // Totals
  document.getElementById("subtotal").innerText = "Subtotal: ₹" + subtotal;
  document.getElementById("total").innerText = "Total: ₹" + finalTotal;
}

function getNextInvoiceNumber() {
  const prefix = "VHB101";

  let lastNumber = parseInt(localStorage.getItem("invoiceCounter")) || 0;

  lastNumber += 1;

  localStorage.setItem("invoiceCounter", lastNumber);

  return prefix + String(lastNumber).padStart(3, "0");
}

/* ---------------- DOWNLOAD PDF ---------------- */
async function downloadPDF() {

  if (items.length === 0) {
    alert("Add items before downloading PDF");
    return;
  }

  const { jsPDF } = window.jspdf;
  const invoice = document.getElementById("invoice");

  const canvas = await html2canvas(invoice, {
    scale: 3,
    useCORS: true
  });

  const imgData = canvas.toDataURL("image/jpg");

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = 210;
  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  pdf.addImage(imgData, "JPG", 0, 0, imgWidth, imgHeight);

  const fileName = currentInvoiceNumber 
  ? currentInvoiceNumber + ".pdf" 
  : "invoice.pdf";

  pdf.save(fileName);
}