const deleteCategoryButtonElements = document.querySelectorAll(
  ".product-item button"
);

async function deleteCategory(event) {
  const buttonElement = event.target;
  const categoryId = buttonElement.dataset.categoryid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch(
    "/admin/categories/" + categoryId + "?_csrf=" + csrfToken,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    alert("Something went wrong!");
    return;
  }

  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
}

for (const deleteCategoryButtonElement of deleteCategoryButtonElements) {
  deleteCategoryButtonElement.addEventListener("click", deleteCategory);
}
