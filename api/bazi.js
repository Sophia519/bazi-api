import { Lunar } from 'lunar-javascript';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { year, month, day, hour, minute } = req.body;

    const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const lunar = Lunar.fromDate(date);

    const eightChar = lunar.getEightChar();
    const result = {
      year: {
        stem: eightChar.getYearGan(),
        branch: eightChar.getYearZhi()
      },
      month: {
        stem: eightChar.getMonthGan(),
        branch: eightChar.getMonthZhi()
      },
      day: {
        stem: eightChar.getDayGan(),
        branch: eightChar.getDayZhi()
      },
      hour: {
        stem: eightChar.getTimeGan(),
        branch: eightChar.getTimeZhi()
      }
    };

    res.status(200).json(result);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Failed to calculate Bazi' });
  }
}
