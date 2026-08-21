# syntax=docker/dockerfile:1
ARG VOLTO_VERSION=19
FROM plone/frontend-builder:${VOLTO_VERSION}

ARG ADDON_NAME
ARG ADDON_PATH
ARG CHROMIUM_VERSION=149.0.7827.196-1~deb12u1

ENV HOST="0.0.0.0"
ENV ADDON_NAME=${ADDON_NAME}
ENV CHROME_BIN="/usr/bin/chromium"
ENV CHROMIUM_BIN="/usr/bin/chromium"
ENV CYPRESS_BROWSER_PATH="/usr/bin/chromium"
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER root
RUN apt-get update -q \
    && apt-get install -qy --no-install-recommends xvfb \
    && rm -rf /var/lib/apt/lists/*

RUN set -eux; \
    mkdir -p /etc/apt/sources.list.d /etc/apt/preferences.d /etc/apt/apt.conf.d; \
    printf '%s\n' \
      'Acquire::Check-Valid-Until "false";' \
      > /etc/apt/apt.conf.d/99snapshot-no-check-valid-until; \
    printf '%s\n' \
      'deb [check-valid-until=no] http://snapshot.debian.org/archive/debian-security/20260630T000000Z bookworm-security main' \
      'deb [check-valid-until=no] http://snapshot.debian.org/archive/debian/20260630T000000Z bookworm main' \
      > /etc/apt/sources.list.d/bookworm-chromium149-snapshot.list; \
    apt-get update -q; \
    apt-get install -qy --no-install-recommends \
      "chromium=${CHROMIUM_VERSION}" \
      "chromium-common=${CHROMIUM_VERSION}"; \
    apt-mark hold chromium chromium-common; \
    rm -rf /var/lib/apt/lists/*

USER node

COPY --chown=node:node ./package.json /app/packages/${ADDON_PATH}/package.json
RUN --mount=type=cache,id=pnpm,target=/app/.pnpm-store,uid=1000 \
    set -- \
      "${ADDON_NAME}@workspace:*" \
      "@eeacms/volto-controlpanel@2.0.1" \
      "@eeacms/volto-matomo@7.0.1" \
      "@plone-collective/volto-sentry@1.0.1" \
      "@eeacms/volto-sentry-rancher-config@6.0.3" \
      "@eeacms/volto-corsproxy@5.0.1" \
      "@eeacms/volto-taxonomy@6.0.2" \
      "@eeacms/volto-object-widget@9.1.1" \
      "@eeacms/volto-widget-theme-picker@3.0.1" \
      "@eeacms/volto-widget-toggle@5.0.1" \
      "@eeacms/volto-widget-temporal-coverage@7.0.1" \
      "@eeacms/volto-widget-geolocation@8.0.1" \
      "@eeacms/volto-widget-dataprovenance@2.0.1" \
      "@eeacms/volto-slate-metadata-mentions@9.0.1" \
      "@eeacms/volto-slate-footnote@8.0.2" \
      "@eeacms/volto-slate-zotero@7.0.1" \
      "@eeacms/volto-slate-label@2.0.1" \
      "@eeacms/volto-accordion-block@13.0.3" \
      "@eeacms/volto-block-divider@8.0.2" \
      "@eeacms/volto-block-toc@9.0.1" \
      "@eeacms/volto-call-to-action-block@6.0.1" \
      "@eeacms/volto-description-block@3.0.1" \
      "@eeacms/volto-hero-block@9.0.2" \
      "@eeacms/volto-listing-block@10.0.2" \
      "@eeacms/volto-metadata-block@9.0.2" \
      "@eeacms/volto-nextcloud-video-block@3.0.2" \
      "@eeacms/volto-group-block@10.0.3" \
      "@eeacms/volto-columns-block@9.0.4" \
      "@eeacms/volto-quote-block@4.0.1" \
      "@eeacms/volto-statistic-block@7.0.1" \
      "@eeacms/volto-tags-block@4.0.1" \
      "@eeacms/volto-timeline-block@3.0.1" \
      "@eeacms/volto-resize-helper@3.0.1" \
      "@eeacms/volto-block-image-cards@4.0.2" \
      "@eeacms/volto-block-style@9.0.1" \
      "@eeacms/volto-tabs-block@10.0.4" \
      "@eeacms/volto-banner@5.1.2" \
      "@eeacms/volto-anchors@2.0.1" \
      "@eeacms/volto-toolbar-actions@3.0.1" \
      "@eeacms/volto-block-data-table@2.0.2"; \
    for dependency in \
      "components:@plone/components" \
      "volto-razzle:@plone/razzle" \
      "volto-slate:@plone/volto-slate"; do \
      package_dir="${dependency%%:*}"; \
      package_name="${dependency#*:}"; \
      if [ -f "/app/core/packages/${package_dir}/package.json" ]; then \
        set -- "$@" "${package_name}@workspace:*"; \
      fi; \
    done; \
    if [ ! -f /app/core/packages/volto-razzle/package.json ]; then \
      razzle_version="$(node -p "require('/app/core/packages/volto/package.json').devDependencies.razzle")"; \
      set -- "$@" "razzle@${razzle_version}"; \
    fi; \
    pnpm --config.auto-install-peers=false add --workspace-root --lockfile-only "$@"; \
    pnpm --config.auto-install-peers=false install --force --no-frozen-lockfile
RUN if [ -f /app/core/packages/registry/package.json ]; then pnpm --filter @plone/registry build; fi

COPY --chown=node:node ./ /app/packages/${ADDON_PATH}/
COPY --chown=node:node ./volto.config.js /app/volto.config.js

ENTRYPOINT ["pnpm"]
CMD ["start"]
