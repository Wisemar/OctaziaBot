const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kicks un membre",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("S'il vous plaît indiquer une personne à kick.")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("S'il vous plaît indiquer une raison de kick.")
                .then(m => m.delete(5000));
        }

        if (!message.member.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ Vous n'avez pas l'autorisation de kick des membres. Veuillez contacter un membre du staff !")
                .then(m => m.delete(5000));
        }

        if (!message.guild.me.hasPermission("KICK_MEMBERS")) {
            return message.reply("❌ Je n'ai pas la permission de kick des membres. Veuillez contacter un membre du staff !")
                .then(m => m.delete(5000));
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toKick) {
            return message.reply("Impossible de trouver ce membre, essayez à nouveau")
                .then(m => m.delete(5000));
        }

        if (toKick.id === message.author.id) {
            return message.reply("Vous ne pouvez pas vous kick ...")
                .then(m => m.delete(5000));
        }

        if (!toKick.kickable) {
            return message.reply("Je ne peux pas kick cette personne à cause de la hiérarchie des rôles, je suppose.")
                .then(m => m.delete(5000));
        }
                
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> membre kick:** ${toKick} (${toKick.id})
            **> Kick par:** ${message.member} (${message.member.id})
            **> Raison:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`Cette vérification devient invalide après 30s.`)
            .setDescription(`Voulez-vous kick ${toKick}?`)

        await message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅","❌"]);

            if (emoji === "✅") {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Eh bien… le kick n'a pas fonctionné. Voici l'erreur ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`Kick annulée.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
