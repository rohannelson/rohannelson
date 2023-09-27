import rss, { pagesGlobToRssItems } from '@astrojs/rss'

export async function GET(context) {
    return rss({
        title: "Rohan Nelson's Blog",
        description: "Sharing and reflecting on my own experiences.",
        site: context.site,
        items: await pagesGlobToRssItems(
            import.meta.glob('./blog/*.{mdx}'),
        ),
    });
}