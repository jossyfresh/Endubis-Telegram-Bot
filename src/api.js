import axios from "axios";
import { API_URL } from "./config/index.js";

export const registerUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/telegram`, user);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const getReferralCode = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/users/${userId}/referral-code`
    );
    if (response.data.isSuccess) {
      return response.data.data.referralCode;
    } else {
      throw new Error("Failed to retrieve referral code.");
    }
  } catch (error) {
    console.error("Error fetching referral code:", error);
    throw error;
  }
};

export const checkUserRegistration = async (telegramId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/users/${telegramId}/referral-code`
    );
    return response.data.isSuccess;
  } catch (error) {
    console.error("Error checking user registration:", error);
    return false;
  }
};

export const getAddressByUsername = async (username, type) => {
  try {
    // Normalize the type parameter
    let normalizedType = type.toUpperCase();
    if (normalizedType === "ADA") {
      normalizedType = "CARDANO";
    }

    const response = await axios.get(
      `${API_URL}/api/wallet/search/${username}/${normalizedType}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching address by username:", error);
    throw error;
  }
};

export const sendTransaction = async (transactionData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/transactions/send/inline`,
      transactionData
    );
    return response.data;
  } catch (error) {
    console.error("Error sending transaction:", error);
    throw error;
  }
};
