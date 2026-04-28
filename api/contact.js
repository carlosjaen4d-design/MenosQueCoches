function obtenerTextoSeguro(valor, longitudMaxima) {
    return String(valor || "")
        .replace(/\r/g, "")
        .trim()
        .slice(0, longitudMaxima);
}

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ error: "Método no permitido." });
    }

    try {
        var body = req.body;

        if (typeof body === "string") {
            body = JSON.parse(body || "{}");
        }

        var nombre = obtenerTextoSeguro(body.nombre, 120);
        var email = obtenerTextoSeguro(body.email, 160);
        var mensaje = obtenerTextoSeguro(body.mensaje, 4000);

        if (nombre.length < 2 || !validarEmail(email) || mensaje.length < 10) {
            return res.status(400).json({ error: "Datos de formulario no válidos." });
        }

        var githubToken = process.env.CONTACT_GITHUB_TOKEN;
        var githubRepo = process.env.CONTACT_GITHUB_REPO;
        var githubAssignee = process.env.CONTACT_GITHUB_ASSIGNEE;

        if (!githubToken || !githubRepo) {
            return res.status(500).json({ error: "El formulario no está configurado todavía." });
        }

        var url = "https://api.github.com/repos/" + githubRepo + "/issues";
        var fecha = new Date().toISOString();
        var titulo = "Nuevo contacto web - " + nombre + " - " + fecha.slice(0, 16).replace("T", " ");
        var remitenteIp = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "No disponible";
        var userAgent = req.headers["user-agent"] || "No disponible";
        var issueBody = [
            "Se ha recibido un nuevo mensaje desde el formulario de MenosQueCoches.",
            "",
            "**Nombre:** " + nombre,
            "**Email:** " + email,
            "**Fecha:** " + fecha,
            "**IP:** " + remitenteIp,
            "**User-Agent:** " + userAgent,
            "",
            "**Mensaje**",
            mensaje
        ].join("\n");

        var payload = {
            title: titulo,
            body: issueBody
        };

        if (githubAssignee) {
            payload.assignees = [githubAssignee];
        }

        var githubResponse = await fetch(url, {
            method: "POST",
            headers: {
                "Accept": "application/vnd.github+json",
                "Authorization": "Bearer " + githubToken,
                "User-Agent": "MenosQueCoches-Contact",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!githubResponse.ok) {
            var errorGithub = await githubResponse.text();
            return res.status(502).json({ error: "No se pudo registrar el mensaje.", details: errorGithub });
        }

        return res.status(200).json({ message: "Mensaje enviado correctamente. Gracias por contactar con nosotros." });
    } catch (error) {
        return res.status(500).json({ error: "Ha ocurrido un error inesperado." });
    }
};
