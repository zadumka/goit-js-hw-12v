import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import fetchPhotos from "./js/pixabay-api";
import createMarkup from "./js/render-functions";
import { gallery, loader } from "./js/render-functions";

const form = document.querySelector(".form");
const button = document.querySelector("button[type='button']");
let searchQuery = "";
let page = 1;
button.style = "display: none";
loader.classList.toggle("loader");

form.addEventListener("submit", renderPhotos);
button.addEventListener("click", getMorePhotos)

function renderPhotos(event) {
    event.preventDefault();
    searchQuery = event.currentTarget.elements.search.value.trim();
    if (!searchQuery) {
        iziToast.error({
            message: "Search field must not be empty!",
            position: "topRight",
        });
        return;
    };
    gallery.innerHTML = "";
    loader.classList.toggle("loader");
    fetchPhotos(searchQuery, page)
        .then(response => {
            if (response.data.totalHits === 0) {
                loader.classList.toggle("loader");
                iziToast.error({
                    message: "Sorry, there are no images matching your search query. Please try again!",
                    position: "topRight",
                });
                button.style = "display: none";
                return;
            };
            createMarkup(response.data.hits);
            button.style = "display: initial";
        })
        .catch(() => {
            loader.classList.toggle("loader");
            loader.innerHTML = "Oops... something went wrong";
        });
};

function getMorePhotos() {
    page += 1;
    loader.classList.toggle("loader");
    const card = document.querySelector(".gallery>li");
    const cardHeight = card.getBoundingClientRect().height;
    fetchPhotos(searchQuery, page)
        .then(response => {
            if (response.data.totalHits < page * 15) {
                button.style = "display: none";
                iziToast.info({
                    message: "We're sorry, but you've reached the end of search results.",
                    position: "topRight",
                });
                loader.classList.toggle("loader");
                return;
            }
            createMarkup(response.data.hits);
            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
            });

        })
        .catch(() => {
            loader.classList.toggle("loader");
            loader.innerHTML = "Oops... something went wrong";
        });
}