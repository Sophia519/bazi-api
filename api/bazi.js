import { Lunar } from 'lunar-javascript';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { year, month, day, hour, minute } = req.body;
    console.log("Incoming data:", req.body);

    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date constructed");
    }
    console.log("Constructed Date:", date);

    let lunar;
    try {
      lunar = Lunar.fromDate(date);
      console.log("Lunar Object:", lunar);
    } catch (e) {
      console.error("Error creating Lunar from date:", e);
      throw e;
    }

    let eightChar;
    try {
      eightChar = lunar.getEightChar();
      console.log("EightChar:", eightChar);
    } catch (e) {
      console.error("Error getting EightChar:", e);
      throw e;
    }

    const result = {
      year: {
        stem: eightChar.getYearGan(),
        branch: eightChar.getYearZhi(),
      },
      month: {
        stem: eightChar.getMonthGan(),
        branch: eightChar.getMonthZhi(),
      },
      day: {
        stem: eightChar.getDayGan(),
        branch: eightChar.getDayZhi(),
      },
      hour: {
        stem: eightChar.getTimeGan(),
        branch: eightChar.getTimeZhi(),
      },
    };

    res.status(200).json(result);
  } catch (err) {
    console.error('❌ Error in API:', err);
    res.status(500).json({ error: 'Failed to calculate Bazi' });
  }
}
