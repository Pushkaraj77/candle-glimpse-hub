import axios from "axios";

export const predictStock = async (stockSymbol) => {
  const response = await axios.post("http://localhost:5000/predict", {
    stockSymbol,
    interval: "5m",
    period: "25d",
  });
  return response.data;
};
