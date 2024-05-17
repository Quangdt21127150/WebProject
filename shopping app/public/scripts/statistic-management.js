const revenueButton = document.querySelector("#revenue");
const quantityButton = document.querySelector("#quantity");
const currentYear = new Date().getFullYear();

let currentChart = null; // Biến để lưu trữ đối tượng biểu đồ hiện tại

function drawLineChart(data, titleString, xValues) {
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
          borderColor: "white",
          hoverBorderWidth: 3,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: titleString, // Tiêu đề của biểu đồ
        fontColor: "white", // Màu của tiêu đề
        fontSize: 20, // Kích thước chữ của tiêu đề
      },
      legend: {
        position: "bottom",
        labels: {
          fontColor: "white",
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "white", // Màu số liệu trên trục X
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
              fontColor: "white", // Màu số liệu trên trục Y
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

function drawStackedBarChart(data, titleString, xValues) {
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
      borderColor: "white",
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
        text: titleString, // Tiêu đề của biểu đồ
        fontColor: "white", // Màu của tiêu đề
        fontSize: 20, // Kích thước chữ của tiêu đề
      },
      legend: {
        position: "bottom",
        labels: {
          fontColor: "white",
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "white", // Màu số liệu trên trục X
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
              fontColor: "white", // Màu số liệu trên trục Y
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
  let xValues = [
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

  if (timeSelect === "month") {
    await fetch("/admin/revenue?_csrf=" + csrfToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        drawLineChart(
          data.data,
          `Revenue by month in the year ${currentYear}`,
          xValues
        );
      });
  } else {
    await fetch("/admin/revenue2?_csrf=" + csrfToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        xValues = [];
        for (let year = currentYear - 9; year <= currentYear; ++year) {
          xValues.push(year);
        }
        drawLineChart(data.data, "Revenue in the last 10 year", xValues);
      });
  }
}

async function getQuantity(event) {
  const buttonElement = event.target;
  const csrfToken = buttonElement.dataset.csrf;
  const timeSelect = document.querySelector("#time").value;
  let xValues = [
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

  if (timeSelect === "month") {
    await fetch("/admin/quantity?_csrf=" + csrfToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        drawStackedBarChart(
          data.data,
          `Number of products sold by month in the year ${currentYear}`,
          xValues
        );
      });
  } else {
    await fetch("/admin/quantity2?_csrf=" + csrfToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        xValues = [];
        for (let year = currentYear - 9; year <= currentYear; ++year) {
          xValues.push(year);
        }
        drawStackedBarChart(
          data.data,
          "Number of products sold in the last 10 year",
          xValues
        );
      });
  }
}

revenueButton.addEventListener("click", getRevenue);
quantityButton.addEventListener("click", getQuantity);
