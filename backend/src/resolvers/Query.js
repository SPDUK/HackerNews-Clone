const Query = {
  async feed(parent, { filter, skip, first, orderBy }, context, info) {
    // If no filter string is provided, then the where object will be just an empty object and no
    // filtering conditions will be applied by the Prisma engine when it returns the response for
    // the links query.
    const where = filter
      ? {
          OR: [{ description_contains: filter }, { url_contains: filter }],
        }
      : {};

    const links = await context.prisma.links({
      where,
      skip,
      first,
      orderBy,
    });

    // using the linksConnection query from the Prisma client API to retrieve the total number of
    // Link elements currently stored in the database.
    // Connection queries expose aggregations https://facebook.github.io/relay/graphql/connections.htm
    const count = await context.prisma
      .linksConnection({
        where,
      })
      .aggregate()
      .count();

    return { links, count };
  },
};

module.exports = Query;
