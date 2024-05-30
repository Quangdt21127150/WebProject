const switch_button = document.querySelector("#switchCheck");
const body_tag = document.body;
const main_header = document.querySelector("#main-header");
const nav_items = main_header.querySelectorAll("a");
const badges = document.querySelectorAll(".badge");
const border_buttons = document.querySelectorAll(".btn-alt");
const solid_buttons = document.querySelectorAll(".btn-solid");
const product_items = document.querySelectorAll(".product-item-content");
const order_items = document.querySelectorAll(".order-item");
const cart_items = document.querySelectorAll(".cart-item");
const cart_total = document.querySelector("#cart-total");
const form = document.querySelector(".form");
const switch_form = document.querySelector("#switch-form");
const labels = document.querySelectorAll("label");
const mobile_menu = document.querySelector("#mobile-menu");
const nav_items_mobile = mobile_menu.querySelectorAll("a");

function setTheme() {
  if (switch_button.checked) {
    body_tag.style.backgroundColor = "white";
    body_tag.style.color = "black";
    main_header.style.backgroundColor = "white";
    main_header.style.borderBottom = "1px solid green";
    main_header.style.color = "green";
    mobile_menu.style.backgroundColor = "white";
    for (const badge of badges) {
      badge.style.backgroundColor = "green";
    }
    for (const nav_item of nav_items) {
      nav_item.style.color = "green";
    }
    for (const nav_item_mobile of nav_items_mobile) {
      nav_item_mobile.style.color = "green";
    }
    for (const solid_button of solid_buttons) {
      solid_button.style.backgroundColor = "green";
      solid_button.style.border = "1px solid green";
    }
    for (const border_button of border_buttons) {
      border_button.style.color = "green";
      border_button.style.border = "1px solid green";
    }
    for (const product_item of product_items) {
      product_item.style.backgroundColor = "#E6E6E6";
      product_item.style.color = "black";
    }
    for (const order_item of order_items) {
      order_item.style.backgroundColor = "#E6E6E6";
      order_item.querySelector("span").style.color = "green";
      order_item.querySelector("a").style.color = "green";
    }
    for (const cart_item of cart_items) {
      cart_item.style.backgroundColor = "#E6E6E6";
    }
    for (const label of labels) {
      label.style.color = "black";
    }
    if (cart_total) {
      cart_total.querySelector("p").style.color = "green";
    }
    if (form) {
      form.style.backgroundColor = "#E6E6E6";
      switch_form.querySelector("a").style.color = "green";
    }
  } else {
    body_tag.style.backgroundColor = "var(--color-gray-500)";
    body_tag.style.color = "var(--color-gray-100)";
    main_header.style.backgroundColor = "var(--color-gray-500)";
    main_header.style.borderBottom = "1px solid var(--color-primary-500)";
    main_header.style.color = "var(--color-primary-400)";
    mobile_menu.style.backgroundColor = "var(--color-gray-700)";
    for (const badge of badges) {
      badge.style.backgroundColor = "var(--color-primary-400)";
    }
    for (const nav_item of nav_items) {
      nav_item.style.color = "var(--color-primary-400)";
    }
    for (const nav_item_mobile of nav_items_mobile) {
      nav_item_mobile.style.color = "var(--color-primary-100)";
    }
    for (const solid_button of solid_buttons) {
      solid_button.style.backgroundColor = "var(--color-primary-500)";
      solid_button.style.border = "1px solid var(--color-primary-500)";
    }
    for (const border_button of border_buttons) {
      border_button.style.color = "var(--color-primary-500)";
      border_button.style.border = "1px solid var(--color-primary-500)";
    }
    for (const product_item of product_items) {
      product_item.style.backgroundColor = "var(--color-gray-400)";
      product_item.style.color = "var(--color-gray-100)";
    }
    for (const order_item of order_items) {
      order_item.style.backgroundColor = "var(--color-gray-400)";
      order_item.querySelector("span").style.color = "var(--color-primary-500)";
      order_item.querySelector("a").style.color = "var(--color-primary-500)";
    }
    for (const cart_item of cart_items) {
      cart_item.style.backgroundColor = "var(--color-gray-400)";
    }
    for (const label of labels) {
      label.style.color = "var(--color-gray-100)";
    }
    if (cart_total) {
      cart_total.querySelector("p").style.color = "var(--color-primary-500)";
    }
    if (form) {
      form.style.backgroundColor = "var(--color-gray-600)";
      switch_form.querySelector("a").style.color = "var(--color-primary-500)";
    }
  }
  localStorage.clear();
  localStorage.setItem("theme", switch_button.checked);
}

document.addEventListener("DOMContentLoaded", () => {
  switch_button.checked = localStorage.getItem("theme") === "true";
  setTheme();
});
switch_button.addEventListener("click", setTheme);
