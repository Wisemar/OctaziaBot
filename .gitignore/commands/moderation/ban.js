const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../functions.js");

module.exports = {
    name: "ban",
    category: "moderation",
    description: "ban un membre",
    usage: "<id | mention>",
    run: async (client, message, args) => {
        const logChannel = message.guild.channels.find(c => c.name === "logs") || message.channel;

        if (message.deletable) message.delete();

        if (!args[0]) {
            return message.reply("S'il vous plaît indiquer une personne à Bannir.")
                .then(m => m.delete(5000));
        }

        if (!args[1]) {
            return message.reply("S'il vous plaît indiquer une raison de ban.")
                .then(m => m.delete(5000));
        }

        if (!message.member.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Vous n'avez pas l'autorisation de ban des membres. Veuillez contacter un membre du staff !")
                .then(m => m.delete(5000));
        
        }

        if (!message.guild.me.hasPermission("BAN_MEMBERS")) {
            return message.reply("❌ Je n'ai pas la permission de ban des membres. Veuillez contacter un membre du staff !")
                .then(m => m.delete(5000));
        }

        const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);

        if (!toBan) {
            return message.reply("Impossible de trouver ce membre, essayez à nouveau")
                .then(m => m.delete(5000));
        }


        if (toBan.id === message.author.id) {
            return message.reply("Vous ne pouvez pas vous ban ...")
                .then(m => m.delete(5000));
        }

        if (!toBan.bannable) {
            return message.reply("Je ne peux pas ban cette personne à cause de la hiérarchie des rôles, je suppose.")
                .then(m => m.delete(5000));
        }
        
        const embed = new RichEmbed()
            .setColor("#ff0000")
            .setThumbnail(toBan.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`**> Membre banni:** ${toBan} (${toBan.id})
            **> banni par:** ${message.member} (${message.member.id})
            **> Raison:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new RichEmbed()
            .setColor("GREEN")
            .setAuthor(`Cette vérification devient invalide après 30s.`)
            .setDescription(`Voulez-vous bannir ${toBan}?`)

        await message.channel.send(promptEmbed).then(async msg => {

            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if (emoji === "✅") {
                msg.delete();

                toBan.ban(args.slice(1).join(" "))
                    .catch(err => {
                        if (err) return message.channel.send(`Eh bien… le ban n'a pas fonctionné. Voici l'erreur ${err}`)
                    });

                logChannel.send(embed);
            } else if (emoji === "❌") {
                msg.delete();

                message.reply(`ban annulée.`)
                    .then(m => m.delete(10000));
            }
        });
    }
};
