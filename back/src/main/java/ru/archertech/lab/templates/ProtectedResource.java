package ru.archertech.lab.templates;

import javax.annotation.security.RolesAllowed;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.time.Instant;

@Path("/api/protected")
@RolesAllowed("user")
public class ProtectedResource {

    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String data() {
        return "secret data from protected api; updated on " + Instant.now();
    }
}