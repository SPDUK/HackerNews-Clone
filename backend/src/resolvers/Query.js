const Query = {
  info: () => `This is the API of a Hackernews Clone`,

  async feed(parent, args, context, info) {
    // If no filter string is provided, then the where object will be just an empty object and no
    // filtering conditions will be applied by the Prisma engine when it returns the response for
    // the links query.
    const where = args.filter
      ? {
          OR: [
            { description_contains: args.filter },
            { url_contains: args.filter },
          ],
        }
      : {};

    const links = await context.prisma.links({
      where,
    });
    return links;
  },
};

module.exports = Query;
