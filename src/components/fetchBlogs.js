import fetchApi from "./strapi"
const blogsG = await fetchApi({
    endpoint: "blogs",
    wrappedByKey: "data",
});
const blogsArray = [];
blogsG.forEach((blog) => blogsArray.push(blog.attributes));
export default blogsArray;