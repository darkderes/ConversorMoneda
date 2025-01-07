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
