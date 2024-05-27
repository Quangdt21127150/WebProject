const revenueButton = document.querySelector("#revenue");
const quantityButton = document.querySelector("#quantity");
const currentYear = new Date().getFullYear();

let currentChart = null; // Biến để lưu trữ đối tượng biểu đồ hiện tại

function drawLineChart(data, chart_title, xValues) {
  if (currentChart) {
    currentChart.destroy(); // Xóa biểu đồ hiện tại nếu tồn tại
  }

  const yValues = data;

  currentChart = new Chart("myChart", {
    type: "line",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "Revenue",
          backgroundColor: "green",
          data: yValues,
          borderWidth: 1,
          borderColor: "gray",
          hoverBorderWidth: 3,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: chart_title, // Tiêu đề của biểu đồ
        fontColor: "gray", // Màu của tiêu đề
        fontSize: 20, // Kích thước chữ của tiêu đề
      },
      legend: {
        position: "bottom",
        labels: {
          fontColor: "gray",
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "gray", // Màu số liệu trên trục X
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.2)", // Màu của đường kẻ trục X
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontColor: "gray", // Màu số liệu trên trục Y
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.2)", // Màu của đường kẻ trục Y
            },
          },
        ],
      },
    },
  });
}

function drawStackedBarChart(data, chart_title, xValues) {
  if (currentChart) {
    currentChart.destroy(); // Xóa biểu đồ hiện tại nếu tồn tại
  }

  let datasets = [];
  for (let product of data) {
    datasets.push({
      label: product[0],
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      }, 0.5)`,
      data: product[1],
      borderWidth: 1,
      borderColor: "gray",
      hoverBorderWidth: 3,
    });
  }

  currentChart = new Chart("myChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: datasets,
    },
    options: {
      title: {
        display: true,
        text: chart_title, // Tiêu đề của biểu đồ
        fontColor: "gray", // Màu của tiêu đề
        fontSize: 20, // Kích thước chữ của tiêu đề
      },
      legend: {
        position: "bottom",
        labels: {
          fontColor: "gray",
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "gray", // Màu số liệu trên trục X
              autoSkip: false, // Không tự động bỏ qua các nhãn
              maxRotation: 0,
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.2)", // Màu của đường kẻ trục X
            },
            stacked: true,
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontColor: "gray", // Màu số liệu trên trục Y
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.2)", // Màu của đường kẻ trục Y
            },
            stacked: true,
          },
        ],
      },
    },
  });
}

async function getRevenue(event) {
  const buttonElement = event.target;
  const csrfToken = buttonElement.dataset.csrf;
  const timeSelect = document.querySelector("#time").value;
  let xValues = [];
  let url = "";
  let chart_title = "";
  if (timeSelect === "month") {
    xValues = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    chart_title = `Revenue by month in the year ${currentYear}`;
  } else {
    for (let year = currentYear - 9; year <= currentYear; ++year) {
      xValues.push(year);
    }
    url = "2";
    chart_title = "Revenue in the last 10 year";
  }

  await fetch("/admin/revenue" + url + "?_csrf=" + csrfToken, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      drawLineChart(data.data, chart_title, xValues);
    });
}

async function getQuantity(event) {
  const buttonElement = event.target;
  const csrfToken = buttonElement.dataset.csrf;
  const timeSelect = document.querySelector("#time").value;
  let xValues = [];
  let url = "";
  let chart_title = "";
  if (timeSelect === "month") {
    xValues = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    chart_title = `Number of products sold by month in the year ${currentYear}`;
  } else {
    for (let year = currentYear - 9; year <= currentYear; ++year) {
      xValues.push(year);
    }
    url = "2";
    chart_title = "Number of products sold in the last 10 year";
  }

  await fetch("/admin/quantity" + url + "?_csrf=" + csrfToken, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      drawStackedBarChart(data.data, chart_title, xValues);
    });
}

revenueButton.addEventListener("click", getRevenue);
quantityButton.addEventListener("click", getQuantity);
