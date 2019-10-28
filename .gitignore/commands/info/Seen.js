const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getMember, formatDate } = require("../../functions.js");

module.exports = {
    name: "seen",
    aliases: ["seen", "user", "info"],
    description: "Renvoie les informations utilisateur",
    usage: "[pseudo | id | mention]",
    run: (client, message, args) => {
        const member = getMember(message, args.join(" "));

        const joined = formatDate(member.joinedAt);
        const roles = member.roles
            .filter(r => r.id !== message.guild.id)
            .map(r => r).join(", ") || 'aucune';

        const created = formatDate(member.user.createdAt);

        const embed = new RichEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)

            .addField('Information du membre:', stripIndents`**> pseudo:** ${member.displayName}
            **> Rejoint le:** ${joined}
            **> Roles:** ${roles}`, true)

            .addField('Information du membre:', stripIndents`**> ID:** ${member.user.id}
            **> Pseudo**: ${member.user.username}
            **> Tag**: ${member.user.tag}
            **> Créé le**: ${created}`, true)
            
            .setTimestamp()

        if (member.user.presence.game) 
            embed.addField('En train de jouer', stripIndents`**> Name:** ${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}