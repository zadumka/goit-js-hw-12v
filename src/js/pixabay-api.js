import axios from "axios";

axios.defaults.baseURL = "https://pixabay.com/api/";

export const searchParams = {
    key: "49370503-7e4a3b73ee503433174e66c4b",
    image_type: "photo",
    orientation: "horizontal",
    per_page: 15,
    safesearch: true,
};

export default async function fetchPhotos(searchQuery, page) {
    searchParams.q = searchQuery;
    searchParams.page = page;
    try {
        const response = await axios.get(`?${new URLSearchParams(searchParams)}`);
        return response.data;
    } catch (error) {
        return error;
    }
};