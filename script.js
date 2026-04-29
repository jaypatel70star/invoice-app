let items = [];
let currentInvoiceNumber = "";

/* ---------------- ADD ITEM ---------------- */
function addItem() {
  const item = document.getElementById("item").value.trim();
  const qty = parseInt(document.getElementById("qty").value);
  const price = parseFloat(document.getElementById("price").value);
  const size = document.getElementById("size").value;

  if (!item || qty <= 0 || price <= 0) {
    alert("Please enter valid item details");
    return;
  }

  const total = qty * price;

  // Save item
  items.push({ item, size, qty, price, total });

  renderTable();

  // Clear inputs
  document.getElementById("item").value = "";
  document.getElementById("size").value = "";
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
        <td>${i.size}</td>
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
  document.getElementById("custEmail").innerText = email || "";

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

  // payment logic
const paymentMethod = document.getElementById("paymentMethod").value;
document.getElementById("payName").innerText = "Name: " + name;
document.getElementById("payMethod").innerText = paymentMethod ? "Method: " + paymentMethod : "";
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

  // Wait for layout to settle
  await new Promise(resolve => setTimeout(resolve, 300));

  // Capture full invoice
  const canvas = await html2canvas(invoice, {
    scale: 2, // balanced for mobile + desktop
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollY: -window.scrollY // important for mobile
  });

  const imgData = canvas.toDataURL("image/png");

  // 🔥 Dynamic PDF size (NO A4, NO splitting)
  const pdf = new jsPDF("p", "px", [
    canvas.width,
    canvas.height
  ]);

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

  const fileName = currentInvoiceNumber
    ? currentInvoiceNumber + ".pdf"
    : "invoice.pdf";

  pdf.save(fileName);
}


// add note
function useDefaultNote() {
  const note = document.getElementById("noteInput").value.trim();
  const noteBox = document.getElementById("noteBox");
  const noteText = document.getElementById("noteText"); 
  if(note) {
    noteBox.style.display = "block";
    noteText.innerText = note;
  } else {
    noteBox.style.display = "none";
  }
}