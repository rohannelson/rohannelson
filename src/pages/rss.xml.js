import rss, { pagesGlobToRssItems } from '@astrojs/rss'

export async function get(context) {
    return rss({
        title: "Rohan Nelson's Blog",
        description: "Sharing and reflecting on my own experiences.",
        site: context.site,
        items: await pagesGlobToRssItems(
            import.meta.glob('./blog/*.mdx')
        ),
        customData: '<languauge>en-au</language>',
        stylesheet: '/pretty-feed-v3.xsl',
        xmlns: { h: 'http://www.w3.org/TR/html4/' },
    });
}