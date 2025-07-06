const AWS = require("aws-sdk");
const sns = new AWS.SNS();
const secretsmanager = new AWS.SecretsManager();
const { createClient } = require("@supabase/supabase-js");

exports.main = async function (event) {
  // 1) fetch supabase service_role key
  const secretArn = process.env.SUPABASE_SECRET_ARN;
  const secretValue = await secretsmanager
    .getSecretValue({ SecretId: secretArn })
    .promise();
  const supabaseKey = secretValue.SecretString;

  // 2) init supabase client
  const supabase = createClient(process.env.SUPABASE_URL, supabaseKey);

  // 3) fetch tasks due today
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, text, user_id")
    .filter("due_date", "lte", new Date().toISOString());

  if (error) {
    console.error("Supabase error", error);
    return;
  }

  // 4) for each task, send an SNS notification
  for (const t of tasks) {
    const msg = `Reminder: "${t.text}" is due today!`;
    await sns
      .publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: msg,
        Subject: "TaskNexus Reminder",
      })
      .promise();
  }

  console.log(`Sent ${tasks.length} reminders.`);
};
