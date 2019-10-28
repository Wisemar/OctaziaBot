  
const { RichEmbed } = require("discord.js");

module.exports = {
    name: "dit",
    aliases: ["bc", "broadcast"],
    category: "moderation",
    description: "Dite se que vous voulez via le bot",
    usage: "<input>",
    run: (client, message, args) => {
        message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES"))
            return message.reply("vous n'avez pas la permission de faire cette commande.").then(m => m.delete(5000));

        if (args.length < 0)
            return message.reply("Rien à dire ?").then(m => m.delete(5000));

        const roleColor = message.guild.me.highestRole.hexColor;

        if (args[0].toLowerCase() === "embed") {
            const embed = new RichEmbed()
                .setDescription(args.slice(1).join(" "))
                .setColor(roleColor === "#000000" ? "#ffffff" : roleColorv);

            message.channel.send(embed);
        } else {
            message.channel.send(args.join(" "));
        }
    }
}