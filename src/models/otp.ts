import { sendMail } from "../utils/email";
import { Time, Database } from "../utils/function";

export interface otp {
    _id?: string,
    otp?: string,
    createdAt?: string,
    expiresAt?: string
}

export interface otpDetails {
    _id?: string,
    otp?: string,
    duration: number,
    subject?: string
    message?: string
}

export const createOTP = (fields: otp): Promise<otp | null> => {
    const { _id, otp, createdAt, expiresAt } = fields;

    const query = Database.createQuery(`INSERT INTO otp (_id, otp, createdAt, expiresAt) VALUES (?,?,?,?)`, [_id, otp, createdAt, expiresAt]);
    return query["affectedRows"] === 1 ? Promise.resolve(query) : Promise.resolve(null);
}

export const getOTP = (otpDetails: otp): Promise<otp | null> => {
    const query =  Database.createQuery(`SELECT * FROM otp WHERE _id = ?`, [Database.fieldsToQuery(otpDetails)] );
    return query["affectedRows"] === 1? Promise.resolve(query) : Promise.resolve(null);
}

export const deleteOTP = (_id: string): Promise<otp | null> => {
    const query = Database.createQuery(`DELETE FROM otp WHERE _id = ?`, [_id]);
    return query["affectedRows"] === 1? Promise.resolve(query) : Promise.resolve(null);
}

export const sendOTP = (otpDetails: otpDetails): Promise<otp | null> => {
    const {_id, otp, subject, message, duration} = otpDetails;

    deleteOTP(_id);
    sendMail(otpDetails);

    const hashedOTP = otp;
    const newOTP = { _id: _id, otp: hashedOTP, createdAt: Date.now().toString(), expiresAt: Time.HoursToDate(duration) }

    const createdOTPRecord = createOTP(newOTP);
    return createdOTPRecord ? Promise.resolve(createdOTPRecord) : Promise.resolve(null);
}

export const verifyOTP = async (otpDetails: otp): Promise<otp | string | null> => {
    const { _id, otp } = otpDetails;

    return getOTP({ _id }).then((matchedOTPRecord) => {
        if (!matchedOTPRecord) Promise.resolve(null);
        const { expiresAt, otp: hashedOTP } = matchedOTPRecord;

        if ( Number(expiresAt) < Date.now() ) return "Oops, OTP code is expired. Request for a new one."
        if (hashedOTP !== otp) return "Oops, OTP code is invalid.";

        deleteOTP(_id);
        return matchedOTPRecord;
    });
}