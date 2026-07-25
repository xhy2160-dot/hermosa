import db from '../models/index.js';

const { ActivityLog } = db;

export const addALog = async (type, actor, verb, object) => {
    try {
        const newLog = await ActivityLog.create({
            type,
            actor,
            verb,
            object,
        });

        return newLog

    } catch (err) {
        console.error('Failed to create activity log:', err);
        throw err;
    }
};