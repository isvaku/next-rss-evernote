import { prisma, PrismaTypes } from "@erss/db";

const create = async (userId: string) => {
  return await prisma.integrations.create({
    data: {
      userId,
    },
  });
};

const findByUserId = async (userId: string) => {
  return await prisma.integrations.findFirst({
    where: {
      userId,
    },
  });
};

const deleteById = async (userId: string) => {
  return await prisma.integrations.updateMany({
    where: {
      userId,
    },
    data: {
      active: false,
    },
  });
};

const updateByIdAndUserId = async (
  id: string,
  userId: string,
  data: PrismaTypes.IntegrationsUpdateInput
) => {
  return await prisma.integrations.update({
    where: {
      id,
      userId,
    },
    data,
  });
};

const updateById = async (
  id: string,
  data: PrismaTypes.IntegrationsUpdateInput
) => {
  return await prisma.integrations.update({
    where: {
      id,
      active: false,
    },
    data,
  });
};

const updateByUserId = async (
  userId: string,
  data: PrismaTypes.IntegrationsUpdateInput
) => {
  return await prisma.integrations.updateMany({
    where: {
      userId,
      active: false,
    },
    data,
  });
};

const setInitialIntegrationData = (
  id: string,
  data: PrismaTypes.IntegrationsUpdateInput
) => {
  return prisma.integrations.update({
    where: {
      id,
      active: false,
      type: "EMPTY",
    },
    data,
  });
};

const findOrCreate = async (userId: string) => {
  let integration = await prisma.integrations.findFirst({
    where: {
      userId,
      active: false,
      type: "EMPTY",
      evernote: null,
    },
  });

  if (!integration) {
    integration = await create(userId);
  }

  return integration;
};

const findByIdAndUserId = (id: string, userId: string) => {
  return prisma.integrations.findFirst({
    where: {
      id,
      userId,
    },
  });
};

export const integrationService = {
  create,
  findByIdAndUserId,
  findByUserId,
  deleteById,
  updateById,
  updateByUserId,
  updateByIdAndUserId,
  setInitialIntegrationData,
  findOrCreate,
};
