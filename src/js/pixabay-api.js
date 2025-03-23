import axios from "axios";

axios.defaults.baseURL = "https://pixabay.com/api/";

const searchParams = {
    key: "49370503-7e4a3b73ee503433174e66c4b",
    image_type: "photo",
    orientation: "horizontal",
    per_page: 9,
    safesearch: true,
};

export default function fetchPhotos(searchQuery) {
    searchParams.q = searchQuery;
    return axios.get(`?${new URLSearchParams(searchParams)}`)
        .then(response => response)
        .catch(error => error);
};