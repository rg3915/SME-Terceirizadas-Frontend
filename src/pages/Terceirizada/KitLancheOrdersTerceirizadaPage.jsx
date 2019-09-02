import React from "react";
import Breadcrumb from "../../components/Shareable/Breadcrumb";
import Page from "../../components/Shareable/Page/Page";
import OrdersDashboardContainer from "../../components/SolicitacaoDeKitLanche/Terceirizada/OrdersDashboardContainer";
import { HOME } from "./constants";
import { SOLICITACAO_KIT_LANCHE } from "../../configs/RoutesConfig";

const atual = {
  href: `${SOLICITACAO_KIT_LANCHE}`,
  titulo: "Solicitações de Kit Lanche"
};

export default props => (
  <Page>
    <Breadcrumb home={HOME} atual={atual} />
    <OrdersDashboardContainer />
  </Page>
);
