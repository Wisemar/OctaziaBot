const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    category: "moderation",
    description: "Reports un membre",
    usage: "<mention, id>",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!rMember)
            return message.reply("Impossible de trouver cette personne !").then(m => m.delete(5000));

        if (rMember.hasPermission("BAN_MEMBERS") || rMember.user.bot)
            return message.channel.send("Impossible de signaler ce membre !").then(m => m.delete(5000));

        if (!args[1])
            return message.channel.send("S'il vous plaît fournir une raison pour le report").then(m => m.delete(5000));
        
        const channel = message.guild.channels.find(c => c.name === "reports")
            
        if (!channel)
            return message.channel.send("Impossible de trouver un canal `# reports`").then(m => m.delete(5000));

        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported membre", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`**> Membre:** ${rMember} (${rMember.user.id})
            **> Reported par:** ${message.member}
            **> Reported dans:** ${message.channel}
            **> Raison:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}