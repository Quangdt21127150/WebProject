const statisticButton = document.querySelector("#showChart");

function drawChart(data) {
  const xValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const yValues = data;
  new Chart("myChart", {
    type: "bar",
    data: {
      labels: xValues,
      datasets: [
        {
          label: "Revenue",
          backgroundColor: "green",
          data: yValues,
          borderWidth: 1,
          borderColor: "#777",
          hoverBorderWidth: 3,
          hoverBorderColor: "#000",
        },
      ],
    },
    options: {
      legend: {
        display: true,
        position: "right",
        labels: {
          fontColor: "white",
        },
      },
      layout: {
        padding: {
          left: 50,
          right: 0,
          bottom: 0,
          top: 0,
        },
      },
      tooltips: {
        enabled: true,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

async function getData(event) {
  const buttonElement = event.target;
  const csrfToken = buttonElement.dataset.csrf;

  await fetch("/admin/statistic?_csrf=" + csrfToken, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      drawChart(data.data);
    });
}

statisticButton.addEventListener("click", getData);
