// Not currently in use - here if I want to come back to it. Can import into components/pages.
export default interface Article {
    id: number;
    attributes: {
      title: string;
      description: string;
      content: string;
      slug: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
    };
  }