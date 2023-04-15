package ru.archertech.lab.templates;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/api/public")
@PermitAll
public class PublicResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String data() {
        return "Public data";
    }
}