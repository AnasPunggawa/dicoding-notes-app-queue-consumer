/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');

class NotesService {
  constructor() {
    this._pool = new Pool();
  }

  /**
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getNotes(userId) {
    const query = {
      text: `
        SELECT
          notes.* 
        FROM
          notes
        LEFT JOIN
          collaborations ON collaborations.note_id = notes.id
        WHERE 
          notes.owner = $1 OR 
          collaborations.user_id = $1
        GROUP BY
          notes.id;
      `,
      values: [userId],
    };

    const { rows } = await this._pool.query(query);

    return rows;
  }
}

module.exports = NotesService;
