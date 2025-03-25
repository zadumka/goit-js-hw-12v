import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import fetchPhotos from "./js/pixabay-api";
import { gallery, lightbox, createMarkup } from "./js/render-functions";

const form = document.querySelector(".form");
const button = document.querySelector("button[type='button']");
const loader = document.querySelector(".loader");

let searchQuery = "";
let page = 1;

button.style = "display: none";
loader.classList.toggle("loader");

form.addEventListener("submit", renderPhotos);
button.addEventListener("click", getMorePhotos)

async function renderPhotos(event) {
    event.preventDefault();
    searchQuery = event.currentTarget.elements.search.value.trim();
    page = 1;
    if (!searchQuery) {
        iziToast.error({
            message: "Search field must not be empty!",
            position: "topRight",
        });
        return;
    };
    gallery.innerHTML = "";
    loader.classList.toggle("loader");
    try {
        const data = await fetchPhotos(searchQuery, page);
        if (data.totalHits === 0) {
            iziToast.error({
                message: "Sorry, there are no images matching your search query. Please try again!",
                position: "topRight",
            });
            button.style = "display: none";
            return;
        }
        createMarkup(data.hits);
        if (data.totalHits < 15) {
            button.style = "display: none";
            return;
        }
        button.style = "display: initial";
    } catch (error) {
        loader.innerHTML = "Oops... something went wrong";
    } finally {
        loader.classList.toggle("loader");
        lightbox.refresh();
    }
};

async function getMorePhotos() {
    page += 1;
    loader.classList.toggle("loader");
    const card = document.querySelector(".gallery>li");
    const cardHeight = card.getBoundingClientRect().height;
    try {
        const data = await fetchPhotos(searchQuery, page);
        if (data.totalHits > 15 * page) {
            createMarkup(data.hits);
            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
            });
        } else {
            button.style = "display: none";
            iziToast.info({
                message: "We're sorry, but you've reached the end of search results.",
                position: "topRight",
            });
        }
    } catch (error) {
        loader.innerHTML = "Oops... something went wrong";
    } finally {
        loader.classList.toggle("loader");
    }
}