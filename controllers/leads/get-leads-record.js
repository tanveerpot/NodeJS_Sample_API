import {
  extend
} from 'lodash';

import Lead from '../../models/lead';

const GetLeadsRecord = async ({
  filter,
  sort,
  skip,
  limit,
  userId
}) => {
  const {
    pageId,
    groupId,
    postId,
    keyword
  } = filter;

  const selector = { userId, isBlocked: false };

  if (keyword) {
    if (keyword.includes(' ')) {
      const regex = new RegExp(keyword.replace(/(\S+)/g, s => `\\b${s}.*`).replace(/\s+/g, ''));
      extend(selector, {
        $or: [
          { name: { $regex: regex, $options: 'i' } },
          { email: { $regex: `.*${keyword}.*`, $options: 'i' } },
          { contact: { $regex: `.*${keyword}.*`, $options: 'i' } },
          { tag: { $regex: regex, $options: 'i' } }
        ]
      });
    } else {
      extend(selector, {
        $or: [
          { name: { $regex: `.*${keyword}.*`, $options: 'i' } },
          { email: { $regex: `.*${keyword}.*`, $options: 'i' } },
          { contact: { $regex: `.*${keyword}.*`, $options: 'i' } },
          { tag: { $regex: `.*${keyword}.*`, $options: 'i' } }
        ]
      });
    }
  } else if (pageId && pageId !== 'All') {
    extend(selector, { pageId });
  } else if (groupId && groupId !== 'All') {
    extend(selector, { groupId });
  } else if (postId && postId !== 'All') {
    extend(selector, { postId });
  }

  const totalLeads = await Lead.find({ userId, isBlocked: false });

  const leadsRecord = await Lead
    .find(selector)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  return {
    total: totalLeads.length,
    leadsRecord
  };
};

export default GetLeadsRecord;
