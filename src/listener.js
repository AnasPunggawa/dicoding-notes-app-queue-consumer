/* eslint-disable no-underscore-dangle */

/**
 * @typedef {import('./NotesService')} NotesService
 * @typedef {import('./MailSender')} MailSender
 * @typedef {import('amqplib').ConsumeMessage} AmqplibConsumeMessage
 */

class Listener {
  /**
   * @param {NotesService} notesService
   * @param {MailSender} mailSender
   */
  constructor(notesService, mailSender) {
    this._notesService = notesService;
    this._mailSender = mailSender;

    this.listen = this.listen.bind(this);
  }

  /**
   * @param {AmqplibConsumeMessage | null} message
   */
  async listen(message) {
    try {
      const { credentialId: userId, targetEmail } = JSON.parse(
        // @ts-ignore
        // eslint-disable-next-line comma-dangle
        message.content.toString()
      );

      const notes = await this._notesService.getNotes(userId);
      const result = await this._mailSender.sendEmail(
        targetEmail,
        // eslint-disable-next-line comma-dangle
        JSON.stringify(notes)
      );

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Listener;
