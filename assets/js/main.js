const getApi = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

const renderDOM = (data) => {
  const fuente = document.getElementById("fuente");
  const amount = document.getElementById("amount").value;
  const fromCurrency = document.getElementById("from-currency").value;
  const toCurrency = document.getElementById("to-currency").value;
  const convertedAmount = (amount / data.dolar.valor).toFixed(2);
  const value = toCurrency === "USD" ? data.dolar.valor : data.euro.valor;
  const money = toCurrency === "USD" ? "dolar" : "euro";

  fuente.textContent = `Fuente : ${data.autor}`;

  document.getElementById(
    "changer"
  ).textContent = `CAMBIO : ${value} ${fromCurrency} = 1 ${toCurrency}`;

  document.getElementById(
    "result"
  ).textContent = `RESULTADO : ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;

  renderGrafica(money);
};

const getApiData = async () => {
  const data = await getApi("https://mindicador.cl/api/");
  console.log(data);
  renderDOM(data);
};

document
  .getElementById("currency-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    getApiData();
  });

let myChartInstance;

async function getAndCreateDataToChart(money) {
  const res = await getApi(`https://www.mindicador.cl/api/${money}`);
  let serie = res.serie.slice(0, 10);
  // Ordenar las fechas de menor a mayor
  serie = serie.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const labels = serie.map((ser) => formatDate(ser.fecha));
  const data = serie.map((mon) => Number(mon.valor));

  return {
    labels,
    datasets: [
      {
        label: `Cambio ${money}`,
        borderColor: "rgb(29, 134, 29)",
        data,
      },
    ],
  };
}

const formatDate = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString("es-ES");
};

async function renderGrafica(money) {
  const data = await getAndCreateDataToChart(money);
  const config = createChartConfig(data);
  const myChart = document.getElementById("myChart");

  // Destruir el gráfico existente si existe
  if (myChartInstance) {
    myChartInstance.destroy();
  }

  myChart.style.backgroundColor = "#333";
  myChartInstance = new Chart(myChart, config);
}

function createChartConfig(data) {
  return {
    type: "line",
    data,
    options: {
      scales: {
        x: {
          ticks: {
            color: "white", // Color de las letras en el eje x
          },
        },
        y: {
          ticks: {
            color: "white", // Color de las letras en el eje y
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "white", // Color de las letras en la leyenda
          },
        },
      },
    },
  };
}
