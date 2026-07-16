export const translations = {
    EN: {
        '24-hour': '24-hour',
        '1-hour': '1-hour',
        reminder: (name, triggerType, date, time, phone, email) =>
            `Hi ${name}, this is a ${triggerType} reminder for your appointment at Hermosa Medspa on ${date} at ${time}. Please contact ${phone} or ${email} to modify your appointment.`,
    },
    'CN_S': { // Simplified Chinese
        '24-hour': '24小时',
        '1-hour': '1小时',
        reminder: (name, triggerType, date, time, phone, email) =>
            `您好 ${name}，这是您在 Hermosa Medspa 的预约提醒（将在 ${triggerType} 后开始）。您的预约时间为 ${date} ${time}。如需修改或取消预约，请联系 ${phone} 或发送邮件至 ${email}。`,
    },
    'CN_T': { // Traditional Chinese
        '24-hour': '24小時',
        '1-hour': '1小時',
        reminder: (name, triggerType, date, time, phone, email) =>
            `您好 ${name}，這是您在 Hermosa Medspa 的預約提醒（將於 ${triggerType} 後開始）。您的預約時間為 ${date} ${time}。如需修改或取消預約，請聯繫 ${phone} 或發送郵件至 ${email}。`,
    },
    KR: { // Korean
        '24-hour': '24시간',
        '1-hour': '1시간',
        reminder: (name, triggerType, date, time, phone, email) =>
            `안녕하세요 ${name}님, Hermosa Medspa 예약 ${triggerType} 전 안내 드립니다. 예약 시간은 ${date} ${time} 입니다. 예약을 변경하시려면 ${phone} 또는 ${email}로 연락해 주시기 바랍니다.`,
    }
};

/**
 * Resolves the final localized reminder string.
 * Falls back safely to English ('en') if an unsupported language is passed.
 */
export const getReminderMessage = (lang, name, triggerType, date, time, phone, email) => {
    const selectedLang = translations[lang] ? lang : 'en';
    const t = translations[selectedLang];

    // Translate the trigger type text ("24-hour" / "1-hour")
    const localizedTrigger = t[triggerType] || triggerType;

    // Build and return the final string
    return t.reminder(name, localizedTrigger, date, time, phone, email);
};