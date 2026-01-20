const buildAuthUrl = (params) => {
  const domain = (process.env.AUTH0_DOMAIN || "").replace(/^https?:\/\//, "");
  if (!domain) {
    throw new Error("AUTH0_DOMAIN is not set");
  }

  const baseUrl = `https://${domain}/authorize`;
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

exports.handler = async (event) => {
  try {
    const origin = event.queryStringParameters?.origin || "";
    const state = origin
      ? Buffer.from(JSON.stringify({ origin })).toString("base64url")
      : "";

    const authUrl = buildAuthUrl({
      response_type: "code",
      client_id: process.env.AUTH0_CLIENT_ID,
      redirect_uri: process.env.AUTH0_CALLBACK_URL,
      scope: "openid profile email",
      state
    });

    return {
      statusCode: 302,
      headers: { Location: authUrl }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Auth start failed."
    };
  }
};
