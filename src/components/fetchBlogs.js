import fetchApi from "./strapi"
const blogsG = await fetchApi({
    endpoint: "blogs",
    wrappedByKey: "data",
});
const blogsArrayG = [];
blogsG.forEach((blog) => blogsArrayG.push(blog.attributes));
export default blogsArrayG;