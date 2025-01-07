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

  fuente.textContent = `Fuente : ${data.autor}`;

  document.getElementById(
    "changer"
  ).textContent = `CAMBIO : ${value} ${fromCurrency} = 1 ${toCurrency}`;

  document.getElementById(
    "result"
  ).textContent = `RESULTADO : ${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;

  //   renderGrafica("euro");
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

async function getAndCreateDataToChart(money) {
  const res = await getApi(`https://www.mindicador.cl/api/${money}`);
  const serie = res.serie.slice(0, 10);
  const labels = serie.map((ser) => {
    return ser.fecha;
  });
  console.log(labels);

  const data = serie.map((mon) => {
    return Number(mon.valor);
  });
  console.log(data);
  const datasets = [
    {
      label: `Cambio ${money}`,
      borderColor: "rgb(29, 134, 29)",
      data,
    },
  ];
  return { labels, datasets };
}

async function renderGrafica(money) {
  const data = await getAndCreateDataToChart(money);
  const config = {
    type: "line",
    data,
  };
  const myChart = document.getElementById("myChart");
  myChart.style.backgroundColor = "#333";
  new Chart(myChart, config);
}
renderGrafica("euro");
