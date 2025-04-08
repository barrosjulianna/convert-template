// Módulo para manipulação de API
const ExchangeAPI = {
  async fetchRates() {
    try {
      const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,GBP-BRL');
      const data = await response.json();
      return {
        USD: parseFloat(data['USDBRL']['bid']),
        EUR: parseFloat(data['EURBRL']['bid']),
        GBP: parseFloat(data['GBPBRL']['bid']),
      };
    } catch (error) {
      console.error("Erro ao buscar cotações:", error);
      return null;
    }
  }
};

// Módulo para manipulação do DOM
const DOMUtils = {
  updateDescription(currency, rate) {
    const description = document.getElementById("description");
    description.textContent = `${currency}$ 1 = R$ ${rate}`;
  },
  updateResult(result) {
    const resultElement = document.getElementById("result");
    resultElement.textContent = `R$ ${result}`;
    document.querySelector("footer").style.display = "block";
  },
  sanitizeInput(input) {
    const hasCaractersRegex = /\D+/g;
    return input.replace(hasCaractersRegex, "");
  }
};

// Módulo principal para lógica de conversão
const CurrencyConverter = {
  rates: {},

  async init() {
    this.rates = await ExchangeAPI.fetchRates();
    if (!this.rates) {
      alert("Erro ao carregar as cotações. Tente novamente mais tarde.");
    }
    this.addEventListeners();
  },

  convert(amount, currency) {
    if (!this.rates[currency]) {
      throw new Error("Moeda não suportada.");
    }
    return (amount / this.rates[currency]).toFixed(2);
  },

  addEventListeners() {
    const form = document.querySelector("form");
    const amountInput = document.getElementById("amount");

    amountInput.addEventListener("input", function () {
      amountInput.value = DOMUtils.sanitizeInput(amountInput.value);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const amount = parseFloat(document.getElementById("amount").value);
      const currency = document.getElementById("currency").value;

      try {
        const result = this.convert(amount, currency);
        DOMUtils.updateDescription(currency, this.rates[currency]);
        DOMUtils.updateResult(result);
      } catch (error) {
        console.error(error.message);
        alert("Erro ao realizar a conversão. Verifique os dados e tente novamente.");
      }
    });
  }
};

// Inicializa o conversor
CurrencyConverter.init();