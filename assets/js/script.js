const apiURL = "https://mindicador.cl/api/";
const buttonConvert = document.getElementById("buttonCurrency");
const amount = document.getElementById("amount");
const selectedCurrency = document.getElementById("currency");
const result = document.querySelector("#showResult");
const chartContainer = document.getElementById("result");

let currencyData;

async function getCurrency() {
  try {
    const res = await fetch(apiURL);
    currencyData = await res.json();
    console.log(currencyData);
  } catch (e) {
    alert(e.message);
  }
}

function conversion() {
  const rate = amount.value;
  const getCurrency = selectedCurrency.value;
  if (!rate || isNaN(rate)) {
    alert("Por favor ingrese un monto válido.");
    amount.value = "";
    return;
  }
  if (getCurrency === "dolar") {
    const exchangeRate = currencyData.dolar.valor;
    const newValue = rate / exchangeRate;
    result.innerHTML = `Resultado: $${newValue.toFixed(2)}`;
    showChart(getCurrency);
  } else if (getCurrency === "euro") {
    const exchangeRate = currencyData.euro.valor;
    const newValue = rate / exchangeRate;
    result.innerHTML = `Resultado: $${newValue.toFixed(2)}`;
    showChart(getCurrency);
  } else {
    alert("Seleccione un tipo de divisa válida");
  }
  amount.value = "";
}

// Obtener los últimos 10 días de datos para la moneda seleccionada
async function getLast10DaysData(currency) {
  let data = [];
  try {
    const res = await fetch(`${apiURL}${currency}`);
    const result = await res.json();
    data = result.serie.slice(0, 10); // Obtiene los últimos 10 datos de la serie
  } catch (error) {
    console.error(`Error al obtener datos: ${error}`);
  }

  // Formatear la fecha al formato "DD-MM-YYYY"
  return data
    .map((item) => ({
      fecha: new Date(item.fecha).toLocaleDateString("es-CL"),
      valor: item.valor,
    }))
    .reverse(); // Ordenar cronológicamente
}

// Función para mostrar el gráfico con Chart.js
async function showChart(currency) {
  const data = await getLast10DaysData(currency);

  // Limpiar cualquier gráfico existente antes de crear uno nuevo
  chartContainer.innerHTML = "";
  const canvas = document.createElement("canvas");
  canvas.id = "currencyChart";
  chartContainer.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((item) => item.fecha), // Fechas en formato DD-MM-YYYY
      datasets: [
        {
          label: `Historial de los últimos 10 días (${currency.toUpperCase()})`,
          data: data.map((item) => item.valor), // Valores de la moneda
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Fecha",
          },
        },
        y: {
          title: {
            display: true,
            text: "Valor",
          },
        },
      },
    },
  });
}

getCurrency();

buttonConvert.addEventListener("click", conversion);
