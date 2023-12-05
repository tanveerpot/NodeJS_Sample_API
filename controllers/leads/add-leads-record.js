import { Types } from "mongoose";

import Lead from "../../models/lead";

const AddLeadsRecord = async ({ data }) => {
  const leadData = await Lead.create({
    _id: Types.ObjectId().toHexString(),
    ...data,
  });

  return {
    message: "Leads Record Saved Successfully",
    data: leadData,
  };
};

export default AddLeadsRecord;
