import Lead from "../../models/lead";

const RemoveLeadsRecord = async ({ userId, leadIds }) => {
  await Lead.deleteMany({ userId, leadId: { $in: leadIds } });

  return { message: "Leads Deleted Successfully" };
};

export default RemoveLeadsRecord;
