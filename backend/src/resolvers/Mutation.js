const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getUserId = require('../utils/getUserId');
const validateUser = require('../utils/validateUser');
const validateLink = require('../utils/validateLink');

const Mutations = {
  async signup(parent, args, context, info) {
    const { name, email, password } = validateUser(
      args.name,
      args.email,
      args.password
    );

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await context.prisma.createUser({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return {
      token,
      user,
    };
  },
  async login(parent, args, context, info) {
    const user = await context.prisma.user({ email: args.email });
    if (!user) {
      throw new Error('No such user found with that email');
    }

    const valid = await bcrypt.compare(args.password, user.password);
    if (!valid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    return {
      token,
      user,
    };
  },
  post(parent, args, context, info) {
    const { url, description } = validateLink(args.url, args.description);
    const userId = getUserId(context);
    return context.prisma.createLink({
      url,
      description,
      postedBy: { connect: { id: userId } },
    });
  },
  async vote(parent, args, context, info) {
    const userId = getUserId(context);

    // The $exists function takes a where filter object that allows to specify certain conditions
    // about elements of that type. Only if the condition applies to at least one element in the
    // database, the $exists function returns true
    const linkExists = await context.prisma.$exists.vote({
      user: { id: userId },
      link: { id: args.linkId },
    });
    if (linkExists) {
      throw new Error(`Already voted for link: ${args.linkId}`);
    }

    // no idea why this breaks with async await but works with a promise.
    context.prisma.link({ id: args.linkId }).then(link => {
      context.prisma.updateLink({
        data: { voteCount: link.voteCount + 1 || 1 },
        where: { id: link.linkId },
      });
    });

    return context.prisma.createVote({
      user: { connect: { id: userId } },
      link: { connect: { id: args.linkId } },
    });
  },
};

module.exports = Mutations;
