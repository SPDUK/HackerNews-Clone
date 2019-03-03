const Query = {
  info: () => `This is the API of a Hackernews Clone`,
  feed(root, args, context, info) {
    return context.prisma.links();
  },
};

module.exports = Query;
